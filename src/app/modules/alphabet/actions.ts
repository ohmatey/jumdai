'use server'

import { revalidatePath } from 'next/cache'
import fs from 'fs'
import path from 'path'
import OpenAI from 'openai'

import type { ThaiAlphabet } from '@/app/types'
import thaiAlphabet from '@/app/utils/thaiAlphabet'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Rate limiting: track requests per IP (in-memory for single instance)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_MAX_REQUESTS = 5
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute

function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  entry.count++
  return true
}

// Sanitize path components to prevent path traversal
function sanitizePathComponent(component: string): string {
  // Remove any path traversal attempts and invalid filename characters
  return component
    .replace(/\.\./g, '')
    .replace(/[/\\]/g, '')
    .replace(/[<>:"|?*\x00-\x1f]/g, '')
    .trim()
}

const findAlphabet = (alphabet: string) => {
  return thaiAlphabet.find((item) => item.alphabet === alphabet)
}

export const generateAlphabetImage = async (thaiAlphabet: ThaiAlphabet, clientIdentifier: string = 'anonymous') => {
  // Rate limiting check
  if (!checkRateLimit(clientIdentifier)) {
    throw new Error('Rate limit exceeded. Please wait before making more requests.')
  }

  if (!thaiAlphabet) {
    throw new Error('Alphabet is required.')
  }

  const { alphabet } = thaiAlphabet

  if (!alphabet) {
    throw new Error('alphabet is required.')
  }

  const singleAlphabet = Array.isArray(alphabet) ? alphabet[0] : alphabet
  const fixedAlphabet = singleAlphabet.split('-').join(' ')

  const alphabetData = findAlphabet(fixedAlphabet)

  if (!alphabetData) {
    throw new Error('Alphabet not found.')
  }

  const prompt = `
    You are a Thai language teacher with world class image generation skills.
    Using a minimal geometric graphic style, generate an image of a '${alphabetData.alphabet}' character, ${alphabetData.thaiExamplePrefix} ${alphabetData.thaiExampleDescription}.
    The Thai character depicts a ${alphabetData?.romanDescription}.

    Rules:
    - Generate an image with a white background, image in the center with no border that explicitly shows the image that portrays the Thai character.
    - Do not include any letters, words, numbers, or hints related to the character in the image.
    - The image should be simple and easy to understand.
    - The image should be in a minimal geometric graphic style
    - The image should be in a square aspect ratio.
    - The image should not have any background.
    - The image should not have additional borders or decorations.
  `

  console.info(`Calling OpenAi to generate image for ${alphabetData.alphabet}`)

  // Call OpenAI to generate an image
  const response = await openai.images.generate({
    prompt,
    model: 'dall-e-3',
  })

  const imageUrl = response.data[0].url

  if (!imageUrl) {
    throw new Error('Image not found.')
  }

  console.info(`Generating image for ${alphabetData.alphabet}`)

  // Fetch the image
  const imageResponse = await fetch(imageUrl)
  const imageBuffer = await imageResponse.arrayBuffer()

  // Sanitize filename components to prevent path traversal
  const sanitizedPrefix = sanitizePathComponent(alphabetData.romanTransliterationPrefix || '')
  const sanitizedTransliteration = sanitizePathComponent(alphabetData.romanTransliteration || '')

  if (!sanitizedPrefix || !sanitizedTransliteration) {
    throw new Error('Invalid alphabet data for filename generation.')
  }

  // Save the image to the public folder
  const filename = `${sanitizedPrefix}-${sanitizedTransliteration}.webp`
  const targetDir = path.join(process.cwd(), 'public', 'thai-alphabet')
  const imagePath = path.join(targetDir, filename)

  // Verify the resolved path is within the target directory (defense in depth)
  const resolvedPath = path.resolve(imagePath)
  const resolvedTargetDir = path.resolve(targetDir)
  if (!resolvedPath.startsWith(resolvedTargetDir + path.sep)) {
    throw new Error('Invalid file path detected.')
  }

  fs.writeFileSync(imagePath, Buffer.from(imageBuffer))

  console.info(`Image finished generating for ${alphabetData.alphabet}`)

  revalidatePath('/alphabet', 'page')
}