import { useState, useEffect } from 'react';

const useControlKey = (): boolean => {
    const [isControlPressed, setControlPressed] = useState<boolean>(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Control') {
                setControlPressed(true);
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === 'Control') {
                setControlPressed(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return isControlPressed;
}

export { useControlKey };
