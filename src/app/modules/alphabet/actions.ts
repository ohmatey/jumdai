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

const findAlphabet = (alphabet: string) => {
  return thaiAlphabet.find((item) => item.alphabet === alphabet)
}

export const generateAlphabetImage = async (thaiAlphabet: ThaiAlphabet) => {
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

  // Save the image to the public folder
  const imagePath = path.join(process.cwd(), `public/thai-alphabet/${alphabetData.romanTransliterationPrefix}-${alphabetData.romanTransliteration}.webp`)
  fs.writeFileSync(imagePath, Buffer.from(imageBuffer))

  console.info(`Image finished generating for ${alphabetData.alphabet}`)

  revalidatePath('/alphabet', 'page')
}