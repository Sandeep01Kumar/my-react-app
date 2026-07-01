import styles from './Container.module.css'

function Container({
  as: Component = 'div',
  size = 'default',
  className = '',
  children,
  ...rest
}) {
  const classes = [styles.container, styles[size], className]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  )
}

export default Container
