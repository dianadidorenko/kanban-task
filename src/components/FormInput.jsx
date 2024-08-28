import { XCircle } from "lucide-react";
import React from "react";

const FormInput = ({
  id,
  label,
  type,
  className,
  placeholder,
  errors,
  defaultValue,
  ref,
}) => {
  return (
    <div>
      <div>
        {label ? (
          <label className="text-sm font-semibold text-slate-700" htmlFor={id}>
            {label}
          </label>
        ) : null}

        <input
          type={type}
          className={className}
          placeholder={placeholder}
          name={id}
          defaultValue={defaultValue}
          ref={ref}
        />
      </div>
      <div className="mt-2 text-xs text-red-600" id={`${id}-error`}>
        {errors?.[id]?.map((error) => (
          <div key={error} className="">
            <XCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormInput;
