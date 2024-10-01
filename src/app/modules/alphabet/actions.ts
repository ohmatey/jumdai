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

const findAlphabet = (romanization: string) => {
  return thaiAlphabet.find((item) => item.romanization === romanization)
}

export const generateAlphabetImage = async (alphabet: ThaiAlphabet) => {
  if (!alphabet) {
    throw new Error('Alphabet is required.')
  }

  const { romanization } = alphabet

  if (!romanization) {
    throw new Error('Romanization is required.')
  }

  const singleAlphabet = Array.isArray(romanization) ? romanization[0] : romanization
  const fixedAlphabet = singleAlphabet.split('-').join(' ')

  const alphabetData = findAlphabet(fixedAlphabet)

  if (!alphabetData) {
    throw new Error('Alphabet not found.')
  }

  const prompt = `
    You are a Thai language teacher with world class image generation skills.
    Using a minimal geometric graphic style, generate an image of a '${alphabetData.alphabet}' character.
    The Thai character depicts a ${alphabetData?.romanExampleDescription}.

    Rules:
    - Generate an image with a white background, image in the center with no border that explicitly shows the image that portrays the Thai character.
    - Do not include any letters, words, numbers, or hints related to the character in the image.
    - The image should be simple and easy to understand.
    - The image should be in a minimal geometric graphic style
    - The image should be in a square aspect ratio.
    - The image should not have any background.
    - The image should not have additional borders or decorations.
  `

  console.info(`Calling OpenAi to generate image for ${alphabetData.romanization}`)

  // Call OpenAI to generate an image
  const response = await openai.images.generate({
    prompt,
    model: 'dall-e-3',
  })

  const imageUrl = response.data[0].url

  if (!imageUrl) {
    throw new Error('Image not found.')
  }

  console.info(`Generating image for ${alphabetData.romanization}`)

  // Fetch the image
  const imageResponse = await fetch(imageUrl)
  const imageBuffer = await imageResponse.arrayBuffer()

  // Save the image to the public folder
  const imagePath = path.join(process.cwd(), `public/thai-alphabet/${alphabetData.romanization.split(' ').join('-')}.webp`)
  fs.writeFileSync(imagePath, Buffer.from(imageBuffer))

  console.info(`Image finished generating for ${alphabetData.romanization}`)

  revalidatePath('/alphabet', 'page')
}