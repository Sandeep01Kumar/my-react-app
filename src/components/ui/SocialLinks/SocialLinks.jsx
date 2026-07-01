/**
 * SocialLinks — reusable, data-decoupled UI primitive that renders a row of
 * social/contact links as icon-only external anchors.
 *
 * Consumed by the Hero social row and the Footer social column. The component
 * is intentionally decoupled from the data and icon libraries: consumers import
 * `socials` from `@/data` and pass it via the `items` prop, so this file only
 * imports its own CSS Module. It is the single enforcement point for two
 * concerns: icon-only link accessibility (each anchor gets an `aria-label` from
 * `item.label`, while the icon is `aria-hidden`) and safe external links
 * (`http`/`https` links open in a new tab with `rel="noopener noreferrer"`,
 * whereas `mailto:`/`tel:` links stay in the same tab with no `target`/`rel`).
 *
 * @param {Object} props
 * @param {Array<{ label: string, href: string, icon: React.ComponentType }>} [props.items=[]]
 *   Social links to render. `icon` is a component reference (e.g. a react-icons
 *   component) rendered as `<Icon aria-hidden />`. `label` is used both as the
 *   React `key` and the anchor's accessible name (`aria-label`).
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] Visual size of each icon link.
 * @param {string} [props.className] Optional extra class(es) merged onto the root `<ul>`.
 * @param {...any} rest Any additional props spread onto the root `<ul>` (e.g. `id`, `aria-label`, `style`).
 * @returns {JSX.Element} A semantic `<ul>` list of icon-only anchor links.
 */
import styles from './SocialLinks.module.css'

function SocialLinks({ items = [], size = 'md', className, ...rest }) {
  const rootClass = [styles.socials, styles[size], className]
    .filter(Boolean)
    .join(' ')

  return (
    <ul className={rootClass} {...rest}>
      {items.map((item) => {
        const isExternal = item.href.startsWith('http')
        const Icon = item.icon

        return (
          <li key={item.label} className={styles.item}>
            <a
              className={styles.link}
              href={item.href}
              aria-label={item.label}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
            >
              <Icon aria-hidden />
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default SocialLinks
