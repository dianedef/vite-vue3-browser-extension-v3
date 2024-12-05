import { mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import Install from '../install.vue'
import Update from '../update.vue'
import Changelog from '../Changelog.vue'

// Déclaration des types pour les variables d'environnement
declare global {
  namespace NodeJS {
    interface Global {
      __VERSION__: string
      __DISPLAY_NAME__: string
      __CHANGELOG__: string
      __GIT_COMMIT__: string
      __GITHUB_URL__: string
    }
  }
}

beforeAll(() => {
  // @ts-ignore
  global.__VERSION__ = '1.0.0'
  // @ts-ignore
  global.__DISPLAY_NAME__ = 'Test Extension'
  // @ts-ignore
  global.__CHANGELOG__ = '# Changelog\n- Test update'
  // @ts-ignore
  global.__GIT_COMMIT__ = 'abc123'
  // @ts-ignore
  global.__GITHUB_URL__ = 'https://github.com/test/repo'
})

describe('install component', () => {
  it('devrait afficher le message d\'installation', () => {
    const wrapper = mount(Install)
    
    expect(wrapper.text()).toContain('Installed!')
    expect(wrapper.text()).toContain('Test Extension')
    expect(wrapper.text()).toContain('Version: 1.0.0')
  })

  it('devrait avoir les classes CSS appropriées', () => {
    const wrapper = mount(Install)
    
    expect(wrapper.find('h1').classes()).toContain('text-4xl')
    expect(wrapper.find('h1').classes()).toContain('font-bold')
  })
})

describe('update component', () => {
  it('devrait afficher le message de mise à jour', () => {
    const wrapper = mount(Update, {
      global: {
        stubs: {
          Changelog: true
        }
      }
    })
    
    expect(wrapper.text()).toContain('Updated!')
    expect(wrapper.text()).toContain('Test Extension')
    expect(wrapper.text()).toContain('Version: 1.0.0')
  })

  it('devrait afficher le changelog', () => {
    const wrapper = mount(Update, {
      global: {
        components: {
          Changelog
        }
      }
    })
    
    expect(wrapper.text()).toContain("What's new?")
    expect(wrapper.findComponent(Changelog).exists()).toBe(true)
  })

  it('devrait avoir un lien vers le commit', () => {
    const wrapper = mount(Update, {
      global: {
        components: {
          Changelog
        },
        mocks: {
          __VERSION__: '1.0.0',
          __GIT_COMMIT__: 'abc123',
          __GITHUB_URL__: 'https://github.com/test/repo'
        }
      }
    })
    
    const changelog = wrapper.findComponent(Changelog)
    const commitLink = changelog.find('a[href*="commit"]')
    expect(commitLink.exists()).toBe(true)
    expect(commitLink.attributes('href')).toBe('https://github.com/test/repo/commit/abc123')
  })
}) 