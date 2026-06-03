import { ContentSection } from '../components/content-section'
import { ShopifyAccount } from './shopify-account'

export function SettingsProfile() {
  return (
    <ContentSection
      title='Profile'
      desc='Your Shopify staff account used to access this admin.'
    >
      <ShopifyAccount />
    </ContentSection>
  )
}
