import loginStyles from '../styles/LoginPageStyles.module.css';

interface FormInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

export default function FormInput({ type, placeholder, value, onChange, required }: FormInputProps) {
  return (
    <input
      className={loginStyles['input-field']}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    />
  );
}