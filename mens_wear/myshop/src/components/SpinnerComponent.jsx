// src/components/SpinnerComponent.js
import React from 'react';
import { Spinner as BootstrapSpinner } from 'react-bootstrap'; // Import Bootstrap Spinner component

const SpinnerComponent = ({ size = "lg", variant = "primary", message = "Loading..." }) => {
    return (
        <div className="text-center">
            <BootstrapSpinner
                animation="border"
                role="status"
                variant={variant}
                size={size}
            />
            <div className="mt-3">{message}</div>
        </div>
    );
};

export default SpinnerComponent;
