
const FormGroup = ({ label, placeholder, value, onChange, type = 'text', name, required = false, minLength }) => {
  return (
    <div className='form-group'>
      <label htmlFor={name || label}>{label}</label>
      <input
        value={value}
        onChange={onChange}
        type={type}
        id={name || label}
        name={name || label}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
      />
    </div>
  )
}

export default FormGroup
