import styles from '../styles/Loader.module.scss'

export default function Loader() {
    return (
        <div className={styles.div} >
            <span className={styles.anim1}>Meme</span> &nbsp;
            <span className={`${styles.anim1} ${styles.delay}`} >Machine</span>
        </div>
    )
}