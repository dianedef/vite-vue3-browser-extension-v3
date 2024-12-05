import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import Install from '../install.vue'
import Update from '../update.vue'
import Changelog from '../Changelog.vue'

describe('install component', () => {
  beforeEach(() => {
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

  it('devrait avoir un message de fermeture de l\'onglet', () => {
    const wrapper = mount(Install)
    expect(wrapper.text()).toContain('Now you can close this tab')
  })
})

describe('update component', () => {
  const defaultProvide = {
    __VERSION__: '1.0.0',
    __DISPLAY_NAME__: 'Test Extension',
    __CHANGELOG__: '# Changelog\n- Test update',
    __GIT_COMMIT__: 'abc123',
    __GITHUB_URL__: 'https://github.com/test/repo'
  }

  it('devrait afficher le message de mise à jour', () => {
    const wrapper = mount(Update, {
      global: {
        stubs: {
          Changelog: true
        },
        provide: defaultProvide
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
        },
        provide: defaultProvide
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
        provide: defaultProvide
      }
    })
    
    const changelog = wrapper.findComponent(Changelog)
    const commitLink = changelog.find('a[href*="commit"]')
    expect(commitLink.exists()).toBe(true)
    expect(commitLink.attributes('href')).toBe('https://github.com/test/repo/commit/abc123')
  })

  it('devrait avoir les icônes correctement affichées', () => {
    const wrapper = mount(Update, {
      global: {
        stubs: {
          'i-fa-solid-dice-five': true,
          'i-heroicons-outline:menu-alt-2': true,
          'i-heroicons-outline-menu-alt-2': true,
          Changelog: true
        },
        provide: defaultProvide
      }
    })
    
    const diceIcon = wrapper.find('[data-test="dice-icon"]')
    const menuIcon = wrapper.find('[data-test="menu-icon"]')
    expect(diceIcon.exists()).toBe(true)
    expect(menuIcon.exists()).toBe(true)
  })
})

describe('changelog component', () => {
  it('devrait afficher le contenu du changelog formaté en markdown', () => {
    const wrapper = mount(Changelog, {
      global: {
        provide: {
          __VERSION__: '1.0.0',
          __CHANGELOG__: '# Test\n- Point 1\n- Point 2',
          __GIT_COMMIT__: 'abc123',
          __GITHUB_URL__: 'https://github.com/test/repo'
        }
      }
    })
    
    const content = wrapper.find('.changelog')
    expect(content.exists()).toBe(true)
    expect(content.html()).toContain('<h1>Test</h1>')
    expect(content.html()).toContain('<li>Point 1</li>')
    expect(content.html()).toContain('<li>Point 2</li>')
  })

  it('devrait avoir les styles appropriés pour les éléments du changelog', () => {
    const wrapper = mount(Changelog, {
      global: {
        provide: {
          __VERSION__: '1.0.0',
          __CHANGELOG__: '# Test',
          __GIT_COMMIT__: 'abc123',
          __GITHUB_URL__: 'https://github.com/test/repo'
        }
      }
    })
    const changelog = wrapper.find('.changelog')
    expect(changelog.classes()).toContain('prose')
  })

  it('devrait afficher la version et le lien du commit', () => {
    const wrapper = mount(Changelog, {
      global: {
        provide: {
          __VERSION__: '2.0.0',
          __CHANGELOG__: '# Changelog\n- Test update',
          __GIT_COMMIT__: 'def456',
          __GITHUB_URL__: 'https://github.com/test/repo'
        }
      }
    })
    
    expect(wrapper.text()).toContain('Version: 2.0.0')
    expect(wrapper.text()).toContain('#def456')
    
    const commitLink = wrapper.find('a[href*="commit"]')
    expect(commitLink.attributes('href')).toBe('https://github.com/test/repo/commit/def456')
    expect(commitLink.classes()).toContain('text-green-500')
  })
}) 