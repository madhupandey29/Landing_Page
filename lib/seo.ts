import { getApiUrl } from './env'

export interface SeoData {
  openGraph: {
    video: {
      url: string;
      secure_url: string;
      type: string;
      width: number | null;
      height: number | null;
    };
    images: any[];
  };
  twitter: {
    image: string;
    player: string;
    player_width: number;
    player_height: number;
  };
  _id: string;
  product: string;
  location: string;
  popularproduct: boolean;
  topratedproduct: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  BreadcrumbJsonLd: string;
  LocalBusinessJsonLd: string;
  LogoJsonLd: string;
  VideoJsonLd: string;
  appleStatusBarStyle: string;
  author_name: string;
  canonical_url: string;
  charset: string;
  contentLanguage: string;
  description: string;
  description_html: string;
  excerpt: string;
  formatDetection: string;
  googleSiteVerification: string;
  hreflang: string;
    keywords: string;
  locationCode: string;
  mobileWebAppCapable: string;
  msValidate: string;
  ogDescription: string;
  ogLocale: string;
  ogSiteName: string;
  ogTitle: string;
  ogType: string;
  ogUrl: string;
  productIdentifier: string;
  productdescription: string;
  purchasePrice: number;
  rating_count: number;
  rating_value: number;
  robots: string;
  salesPrice: number;
  sku: string;
  themeColor: string;
  title: string;
  twitterCard: string;
  twitterDescription: string;
  twitterSite: string;
  twitterTitle: string;
  viewport: string;
  xUaCompatible: string;
  x_default: string;
}

export interface ProductData {
  _id: string;
  name: string;
  img: string;
  image1: string;
  image2: string;
  video: string;
  videoThumbnail: string;
  color: any[];
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: SeoData[];
  total: number;
}

interface ProductApiResponse {
  success: boolean;
  data: ProductData[];
}

export async function fetchSeoData(slug: string): Promise<SeoData | null> {
  console.log(`🔍 Fetching SEO data for slug: ${slug}`)
  
  try {
    const apiUrl = getApiUrl('api/seo')
    console.log(`📡 Making API request to: ${apiUrl}`)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout for better error handling
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })
    
    if (!response.ok) {
      console.error(`❌ API request failed with status: ${response.status}`)
      throw new Error(`Failed to fetch SEO data: ${response.status} ${response.statusText}`)
    }
    
    const apiResponse: ApiResponse = await response.json()
    console.log(`✅ API response received:`, apiResponse)
    
    if (!apiResponse.success) {
      console.error(`❌ API returned success: false`)
      return null
    }
    
    if (!apiResponse.data || apiResponse.data.length === 0) {
      console.log(`⚠️ No SEO data found in API response`)
      return null
    }
    
    console.log(`📊 Found ${apiResponse.data.length} SEO records`)
    
    // Find the matching slug in the data array
    const matchingSeoData = apiResponse.data.find(item => item.slug === slug)
    
    if (!matchingSeoData) {
      console.log(`❌ No SEO data found for slug: ${slug}`)
      console.log(`📋 Available slugs:`, apiResponse.data.map(item => item.slug))
      return null
    }
    
    console.log(`✅ Found matching SEO data for slug: ${slug}`)
    return matchingSeoData
    
  } catch (error) {
    console.error(`❌ Error fetching SEO data for slug ${slug}:`, error)
    
    // If it's a network error, provide more helpful logging
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error(`🌐 Network error - Make sure your API server is running at ${getApiUrl('api/seo')}`)
    }
    
    return null
  }
}

export async function fetchProductData(): Promise<ProductData[]> {
  console.log(`🔍 Fetching product data`)
  
  try {
    const apiUrl = getApiUrl('api/product')
    console.log(`📡 Making API request to: ${apiUrl}`)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })
    
    if (!response.ok) {
      console.error(`❌ API request failed with status: ${response.status}`)
      throw new Error(`Failed to fetch product data: ${response.status} ${response.statusText}`)
    }
    
    const apiResponse: ProductApiResponse = await response.json()
    console.log(`✅ Product API response received:`, apiResponse)
    
    if (!apiResponse.success) {
      console.error(`❌ Product API returned success: false`)
      return []
    }
    
    if (!apiResponse.data || apiResponse.data.length === 0) {
      console.log(`⚠️ No product data found in API response`)
      return []
    }
    
    console.log(`📊 Found ${apiResponse.data.length} product records`)
    return apiResponse.data
    
  } catch (error) {
    console.error(`❌ Error fetching product data:`, error)
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error(`🌐 Network error - Make sure your API server is running at ${getApiUrl('api/product')}`)
    }
    
    return []
  }
}

export async function getProductNameForSlug(slug: string): Promise<string | null> {
  try {
    console.log(`🔍 Getting product name for slug: ${slug}`)
    
    // Fetch both SEO and product data
    const [seoData, products] = await Promise.all([
      fetchSeoData(slug),
      fetchProductData()
    ])
    
    if (!seoData) {
      console.log(`❌ No SEO data found for slug: ${slug}`)
      return null
    }
    
    if (!products.length) {
      console.log(`❌ No products found in API response`)
      return null
    }
    
    console.log(`📊 Found ${products.length} products, looking for product ID: ${seoData.product}`)
    
    // Find the product that matches the SEO product ID
    const matchingProduct = products.find(product => product._id === seoData.product)
    
    if (!matchingProduct) {
      console.log(`❌ No product found matching SEO product ID: ${seoData.product}`)
      console.log(`📋 Available product IDs:`, products.map(p => p._id))
      return null
    }
    
    console.log(`✅ Found matching product: ${matchingProduct.name}`)
    return matchingProduct.name
    
  } catch (error) {
    console.error(`❌ Error getting product name for slug ${slug}:`, error)
    return null
  }
}
