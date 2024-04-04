import React, { useState } from 'react'
import Collapse from 'react-bootstrap/Collapse'
import styles from './style.module.scss'
import IconCollapse from '../../assets/icon/ic-collapse'
import { Button } from 'react-bootstrap';
function CustomCollapse(props) {
    const {
        isOpen,
        title,
        Content,
    } = props;
    const [open, setOpen] = useState(isOpen);

    
    return (
        <div>
            <div
                onClick={() => setOpen(!open)}
                className={`${styles.collapseContainer} `}
            >
                <p className={styles.collapseTitle}>
                    {title}
                </p>
                <div className={styles.iconCollapse}>
                    <IconCollapse />
                </div>
            </div>
            <Collapse in={open}>
                <Content />
            </Collapse>
        </div>
    );
}

export default CustomCollapse
