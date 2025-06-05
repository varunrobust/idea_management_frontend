import React from "react";

const Footer = () => {
    return (
        <footer
            className="w-full z-50 text-center h-8 flex items-center justify-center bg-header border-t border-header shadow-header"
            style={{backdropFilter: 'blur(12px)'}}
        >
            <h3 className="text-xs font-sans font-semibold w-full h-full flex items-center justify-center text-header">
                Idea Management System
            </h3>
        </footer>
    );
};

export default Footer;
