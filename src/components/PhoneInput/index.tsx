import React from "react";
import { IMaskInput } from "react-imask";

const PhoneInput = React.forwardRef<HTMLInputElement, any>(
  function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <IMaskInput
        {...other}
        mask={[
          {
            mask: "(00) 0000-0000",
          },
          {
            mask: "(00) 00000-0000",
          },
        ]}
        inputRef={ref}
        onAccept={(value: string) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
      />
    );
  }
);

export default PhoneInput;
