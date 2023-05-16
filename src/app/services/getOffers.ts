const infoJobsToken = process.env.INFOJOBS_TOKEN ?? ''

interface APIResultOffer {
  id: string
  title: string
  province: Category
  city: string
  link: string
  category: Category
  contractType: Category
  subcategory: Category
  salaryMin: Category
  salaryMax: Category
  salaryPeriod: Category
  experienceMin: Category
  workDay: Category
  study: Category
  published: Date
  updated: Date
  author: Author
  requirementMin: string
  bold: boolean
  applications: string
  subSegment: number
  executive: boolean
  salaryDescription: string
  urgent: boolean
  color: boolean
  teleworking?: Category
}

interface Author {
  id: string
  name: string
  uri: string
  logoUrl: string
  corporateResponsive: boolean
  showCorporativeHeader: boolean
}

interface Category {
  id: number
  value: string
}

export async function getInfoJobsOffers () {
  const res = await fetch('https://api.infojobs.net/api/7/offer?category=informatica-telecomunicaciones', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${infoJobsToken}`
    }
  })

  const { items }: { items: APIResultOffer[] } = await res.json()

  const listOfOffers = items.map(item => {
    const { id, title, province, experienceMin, link, teleworking } = item

    return {
      id,
      title,
      province: province.value,
      experienceMin: experienceMin.value,
      link,
      teleworking: teleworking?.value ?? 'No especificado'
    }
  })

  return listOfOffers
}
