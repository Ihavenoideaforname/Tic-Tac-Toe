import loginStyles from '../styles/LoginPageStyles.module.css';

interface FormButtonProps {
  text: string;
  loadingText: string;
  isLoading: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

export default function FormButton({ text, loadingText, isLoading, type = "button", disabled, onClick }: FormButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={loginStyles['login-button']}
    >
      {isLoading ? loadingText : text}
    </button>
  );
}