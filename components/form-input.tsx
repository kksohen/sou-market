import { ForwardedRef, forwardRef, InputHTMLAttributes } from "react";

interface FormInputProps{
  /* type: string;
  placeholder: string;
  required: boolean; */
  errors?: string[];
  name: string;
}

const _FormInput = ({errors=[], name,
  ...props
}: FormInputProps & InputHTMLAttributes<HTMLInputElement>, 
ref: ForwardedRef<HTMLInputElement>) => {
  return (
    <div className="flex flex-col gap-2">
        <input 
        ref = {ref}
        {...props}
        name={name}
        className="bg-transparent
        rounded-lg w-full h-10 focus:outline-none border-none
        ring-1 ring-neutral-600 transition
        focus:ring-2 focus:ring-primary
        "
        />
        {errors.map((error, index)=>(
          <span key={index} className="font-medium text-error text-sm">{error}</span>
        ))}
      </div>
  );
};

export default forwardRef(_FormInput);