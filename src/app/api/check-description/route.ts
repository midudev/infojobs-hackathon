import { NextResponse } from 'next/server'
import {
  Configuration,
  ChatCompletionRequestMessageRoleEnum,
  OpenAIApi
} from 'openai'

const infoJobsToken = process.env.INFOJOBS_TOKEN ?? ''
const openaiToken = process.env.OPENAI_TOKEN ?? ''

const configuration = new Configuration({ apiKey: openaiToken })
const openai = new OpenAIApi(configuration)

const INITIAL_MESSAGES = [
  {
    role: ChatCompletionRequestMessageRoleEnum.System,
    content: `Quiero que cuando te pase una descripción de una oferta de trabajo en programación, le des una nota del 1 al 10.

    El formato de respuesta JSON será el siguiente:
    
    {
      "score": [score],
      "message": [message]
    }
    
    Tienes que cambiar lo que hay entre corchetes por el valor. El máximo de caracteres permitido para "message" es de 300. Se conciso, estricto y directo. Apunta los errores clave, especialmente los de ortografía (si existiesen) o recomendaciones claras. Por ejemplo:
    
    {
      "score": 6,
      "message": "Hay faltas de ortografía: 'inscribete', 'solido' y falta usar signos de interrogación. Se repite mucho la palabra HTML. Y faltaría clarificar los proyectos que se harían"
    }`
  }
]

async function getOfferDescriptionById (id: string) {
  const res = await fetch(`https://api.infojobs.net/api/7/offer/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${infoJobsToken}`
    }
  })

  const { description } = await res.json()

  return description
}

export async function GET (request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (id == null) return new Response('Missing id', { status: 400 })

  const description = await getOfferDescriptionById(id)

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      ...INITIAL_MESSAGES,
      {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: description
      }
    ]
  })

  const data = completion.data.choices[0].message?.content ?? ''
  let json

  try {
    json = JSON.parse(data)
    return NextResponse.json(json)
  } catch {
    return new Response('No se ha podido transformar el JSON', { status: 500 })
  }
}
