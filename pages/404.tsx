import styles from '../styles/404.module.scss'

export default function NotFound() {
    return(
        <div className={`${styles.error}`}>
            404
        </div>
    )
}