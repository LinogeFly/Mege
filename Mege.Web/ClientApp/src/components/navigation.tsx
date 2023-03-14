import React from 'react';
import { Link } from "react-router-dom";
import styles from './navigation.module.css';

function Navigation() {
    return (
        <>
            <Link to="/" className={styles.item}>Home</Link>
            <Link to="/new-template" className={styles.item}>Upload new template</Link>
        </>
    );
}

export default Navigation;
