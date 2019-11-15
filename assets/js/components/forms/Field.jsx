import React from 'react';

// - name
// - label
// - value
// - onChange
// - placeholder
// - type
// - error

const Field = ({name,label,value,onChange,placeholder="",type="text",error=""}) => {
    return ( <>
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input 
                type={type}
                placeholder={placeholder || label}
                id={name} 
                value={value}
                onChange={onChange}
                name={name} 
                className={"form-control"+ (error && " is-invalid")}
            />
            {error && <div className="text-danger">{error}</div>}
        </div>
    </> );
}

export default Field;