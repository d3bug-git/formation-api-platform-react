import React from 'react';

const Select = ({name,value,error="",label,onChange,children}) => {
    return ( <>
        <div className="form-group">
                    <label htmlFor={name}>{label}</label>
                    <select 
                        onChange={onChange} 
                        name={name} 
                        id={name} 
                        className={"form-control"+(error && " is-invalid")}
                        value={value}
                    >
                        {children}
                    </select>
                    <div className="invalid-feedback">{error}</div>
                </div>
    </> );
}
 
export default Select;