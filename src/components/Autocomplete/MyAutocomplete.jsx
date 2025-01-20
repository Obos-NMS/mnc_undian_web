import React, { useState, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { InputAdornment, Paper } from "@mui/material";
import { Check, XClose } from "untitledui-js";
import { ChevronDown, ChevronUp } from "untitledui-js";
import SimpleBar from "simplebar-react";
import MyChip from "../Chip/MyChip";

const MyAutocomplete = ({
  options = [],
  value,
  inputType = "text",
  name,
  control,
  error,
  removeable = true,
  disabled = false,
  multiple = false,
  isMultipleSmall = false,
  isTypingValue = false,
  disableClearable = false,
  height,
  placeholder,
  startAdornment,
  endAdornment,
  filterOptions,
  getOptionDisabled,
  getOptionLabel,
  isOptionEqualToValue,
  renderOption,
  renderTag,
  onClick,
  onChange,
  onInputChange,
  onInputFocus,
  onInputKeyUp,
  freeSolo = false,
  loading = false,
}) => {

  const styleTextField = {
    "& .MuiInputBase-root::-webkit-scrollbar": {
      display: "none",
    },
    "& .MuiInputBase-root": {
      borderRadius: "8px",
      padding:
        multiple && !isMultipleSmall
          ? "12px !important"
          : "10px 14px !important",
      height: height
        ? `${height}px`
        : multiple && !isMultipleSmall
          ? "130px"
          : "max-content",
      overflowY: multiple ? "scroll" : "hidden",
      overflowX: "hidden",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      display: "flex",
      alignItems: multiple ? "flex-start" : "center",
      alignContent: "flex-start",
      rowGap: "6px !important",
      columnGap: "8px !important",
      boxShadow: "0px 1px 2px 0px #1018280D",
      border: "1px solid #D0D5DD",
      "&.Mui-error": { border: "1px solid #FDA29B" },
      backgroundColor: "white",
      "& .MuiInputBase-input::placeholder": {
        fontSize: "16px",
        fontFamily: "'Inter', sans-serif",
        fontWeight: "400",
        lineHeight: "24px",
        wordWrap: "break-word",
        color: "#667085",
        opacity: 1,
      },
      "& .MuiInputAdornment-root.MuiInputAdornment-positionEnd": {
        position: "absolute",
        right: "14px",
      },
      "&.Mui-focused": {
        border: "1px solid #AA8E45",
        boxShadow: "0px 0px 0px 4px #f3e7bb",
      },
      "&.Mui-focused.Mui-error": {
        border: "1px solid #FDA29B",
        boxShadow: "0px 0px 0px 4px #F044383D, 0px 1px 2px 0px #1018280D",
      },
      "& .MuiInputBase-input": { padding: "0px", display: multiple ? '' : 'none' },
      "&.Mui-disabled": { backgroundColor: "#F9FAFB", cursor: "not-allowed" },
      "&.Mui-disabled .MuiInputBase-input": {
        WebkitTextFillColor: "#667085",
        color: "#667085",
      },
      "& .MuiInputAdornment-root": { marginRight: "0px", marginLeft: "0px" },
      "& fieldset": { padding: 0, border: "none" },
      "&:hover fieldset": { border: "none" },
      "&.Mui-focused fieldset": { border: "none" },
      "&.Mui-disabled fieldset": { border: "none" },
    },
    "& .MuiFormHelperText-root": {
      paddingTop: "4px",
      margin: "0px !important",
      fontSize: "14px",
      fontWeight: "400",
      lineHeight: "20px",
      wordWrap: "break-word",
      color: "#475467",
      "&.Mui-error": { color: "#D92D20" },
    },
  };

  const stylePapper = {
    "&.MuiPaper-root": {
      marginTop: "4px",
      border: (options && options.length) || value ? "1px solid #EAECF0" : "",
      borderRadius: "8px",
      boxShadow:
        (options && options.length) || value
          ? "0px 4px 6px -2px #10182808"
          : "",
    },
    "&.MuiPaper-root .MuiAutocomplete-listbox": { padding: "4px 0px" },
  };

  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const textFieldRef = useRef();
  useEffect(() => {
    if (!multiple) {
      if (isOpen) {
        textFieldRef.current.style.display = "flex";
        textFieldRef.current.focus();
      } else {
        textFieldRef.current.style.display = "none";
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!multiple) {
      textFieldRef.current.style.display = "none";
    }

    if (!value) {
      setInputValue('');
    }
  }, [value]);

  const ListboxSimpleBar = React.forwardRef(function ListboxSimpleBar(
    props,
    ref
  ) {
    return (
      <SimpleBar {...props} role="listbox" scrollableNodeProps={{ ref: ref }} />
    );
  });
  const isError = error ? Boolean(error) : false;

  const handleClearValue = (e) => {
    setInputValue("");
    onChange && onChange(e, null);
  };

  return (
    <>
      <div>
        <Autocomplete
          inputValue={inputValue}
          loading={loading}
          open={disabled ? false : isOpen}
          freeSolo={freeSolo}
          popupIcon={<></>}
          multiple={multiple}
          options={options ?? []}
          value={multiple ? value ?? [] : value ?? null}
          disabled={disabled}
          fullWidth={true}
          onOpen={(e) => setIsOpen(true)}
          onClose={(e) => setIsOpen(false)}
          ListboxComponent={ListboxSimpleBar}
          onChange={(e, value, state) => {
            if (multiple) {
              setInputValue("");
            } else {
              if (value) {
                if (getOptionLabel) {
                  setInputValue(getOptionLabel(value));
                } else {
                  setInputValue(value.label ?? "");
                }
              }
            }

            if (multiple && isTypingValue) {
              let tempValue = value.map((e) => {
                if (typeof e === "string") {
                  return { label: e.trim() };
                } else {
                  return e;
                }
              });

              const uniqueData = tempValue.filter((obj, index, self) => {
                if (
                  obj.label &&
                  index === self.findIndex((o) => o.label === obj.label)
                ) {
                  return true;
                } else {
                  return false;
                }
              });

              onChange && onChange(e, uniqueData);
            } else {
              onChange && onChange(e, value);
            }
          }}
          disableClearable={multiple ? true : false}
          ListboxProps={{ style: { maxHeight: 320 } }}
          PaperComponent={(props) => <Paper {...props} sx={stylePapper} />}
          isOptionEqualToValue={(option, value) =>
            isOptionEqualToValue
              ? isOptionEqualToValue(option, value)
              : option.label === value.label
          }
          getOptionDisabled={getOptionDisabled}
          getOptionLabel={(option) =>
            getOptionLabel ? getOptionLabel(option) : option.label
          }
          renderOption={(props, option, ownerState) => {
            var selected = false;
            if (value) {
              if (multiple) {
                selected = value.some((e) =>
                  isOptionEqualToValue
                    ? isOptionEqualToValue(option, e)
                    : option?.value === e?.value || option?.id === e?.id
                );
              } else {
                selected = isOptionEqualToValue
                  ? isOptionEqualToValue(option, value)
                  : option?.value === value?.value || option?.id === value?.id;
              }
            }

            return (
              <div
                {...props}
                key={props["data-option-index"]}
                className={`${selected ? "bg-gray-light/50" : ""
                  } px-1.5 py w-full cursor-pointer hover:bg-gray-light/50`}
              >
                <div className="pl-2 pr-2.5 py-2.5 w-full flex items-center gap-x-2">
                  <div className="flex-1 overflow-hidden">
                    {renderOption ? (
                      renderOption(option, { isOption: true, isOptionValue: false })
                    ) : (
                      <p className="text-md-medium text-gray-light/900 truncate px-1">
                        {getOptionLabel
                          ? getOptionLabel(option) ?? ""
                          : option?.label}
                      </p>
                    )}
                  </div>
                  {value && (
                    <span className="text-brand/600 w-5 h-5 min-w-[20px] min-h-[20px]">
                      {selected && <Check size={20} stroke={"currentColor"} />}
                    </span>
                  )}
                </div>
              </div>
            );
          }}
          renderTags={(options, getTagProps, ownerState) => {
            return options.map((option, index) => {
              var { onDelete } = getTagProps({ index });

              return (
                <div
                  key={index}
                  onClick={() => onClick && onClick(option.label)}
                  className="w-max h-max"
                >
                  {renderTag ? (
                    renderTag(option, index, onDelete)
                  ) : (
                    <MyChip
                      label={
                        getOptionLabel
                          ? getOptionLabel(option) ?? ""
                          : option.label
                      }
                      rounded={"md"}
                      color={"modern"}
                      variant={"outlined"}
                      size={"md"}
                      endAdornment={
                        removeable && (
                          <button
                            className={`${option?.disabled || disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            disabled={option?.disabled || disabled}
                            type="button"
                            onClick={onDelete}
                          >
                            <XClose
                              className={"text-gray-light/400"}
                              size={14}
                              strokeWidth={3}
                              stroke={"currentColor"}
                            />
                          </button>
                        )
                      }
                    />
                  )}
                </div>
              );
            });
          }}
          filterOptions={(options, state) => {
            function sortOptions(options, value, isOptionEqualToValue) {
              let selectedOptions = [];
              let unSelectedOptions = [];
              if (multiple) {
                for (let i = 0; i < options.length; i++) {
                  let selected = value && ((value ?? []).some((e) =>
                    isOptionEqualToValue
                      ? isOptionEqualToValue(options[i], e)
                      : options[i]?.value === e?.value ||
                      options[i]?.id === e?.id)
                  );

                  if (selected) {
                    selectedOptions.push(options[i]);
                  } else {
                    unSelectedOptions.push(options[i]);
                  }
                }
              } else {
                for (let i = 0; i < options.length; i++) {
                  let selected = value && (isOptionEqualToValue
                    ? isOptionEqualToValue(options[i], value)
                    : options[i]?.value === value?.value ||
                    options[i]?.id === value?.id);

                  if (selected) {
                    selectedOptions.push(options[i]);
                  } else {
                    unSelectedOptions.push(options[i]);
                  }
                }
              }

              unSelectedOptions = unSelectedOptions.filter((e) => {
                return getOptionLabel
                  ? (getOptionLabel(e) ?? '').trim().toLowerCase().includes(state.inputValue.trim().toLowerCase())
                  : (e?.label ?? '').trim().toLowerCase().includes(state.inputValue.trim().toLowerCase())
              })

              return [...selectedOptions, ...unSelectedOptions];
            }

            return sortOptions(options, value, isOptionEqualToValue) ?? [];
          }}
          renderInput={(params) => {
            const { InputProps } = params;
            return (
              <TextField
                {...params}
                control={control}
                inputRef={textFieldRef}
                type={inputType}
                error={isError}
                disabled={Boolean(disabled)}
                placeholder={(multiple ? (value && Boolean(value.length !== 0)) : Boolean(value)) ? "" : placeholder}
                helperText={isError ? error : ""}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  onInputChange && onInputChange(e);
                }}
                onKeyUp={onInputKeyUp}
                onFocus={(e) => {
                  setInputValue("");
                  onInputFocus && onInputFocus(e);
                }}
                onBlur={(e) => {
                  setIsOpen(false);
                }}
                InputProps={{
                  ...InputProps,
                  startAdornment: multiple ? (
                    InputProps.startAdornment
                  ) : !isOpen ? (
                    value ? (
                      <div
                        className="w-full overflow-hidden px-1 pr-8"
                        onClick={(e) => !disabled && setIsOpen(true)}
                      >
                        {renderOption ? (
                          renderOption(value, { isOption: false, isOptionValue: true })
                        ) : (
                          <p className="text-gray-light/900 text-md-medium truncate">
                            {getOptionLabel
                              ? getOptionLabel(value)
                              : value.label}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div
                        className="w-full overflow-hidden px-1"
                        onClick={(e) => !disabled && setIsOpen(true)}
                      >
                        <p className="text-gray-light/500 text-md-regular">
                          {placeholder}
                        </p>
                      </div>
                    )
                  ) : startAdornment ? (
                    <InputAdornment position="start">
                      {startAdornment}
                    </InputAdornment>
                  ) : null,
                  endAdornment: multiple ? (
                    <></>
                  ) : !disableClearable && value && !isOpen && !disabled ? (
                    <InputAdornment position="end">
                      <button
                        type="button"
                        className="rounded-full w-7 h-7 hover:bg-gray-light/50 flex items-center justify-center text-center"
                        onClick={handleClearValue}
                      >
                        <span>
                          <XClose size={20} stroke={"currentColor"} />
                        </span>
                      </button>
                    </InputAdornment>
                  ) : (
                    <InputAdornment position="end">
                      {endAdornment
                        ? endAdornment
                        : !disabled && (
                          <div>
                            {isOpen ? (
                              <button
                                onClick={(e) => setIsOpen(false)}
                                type="button"
                                className="rounded-full w-7 h-7 hover:bg-gray-light/50 flex items-center justify-center text-center"
                              >
                                <ChevronUp
                                  size={20}
                                  stroke={"currentColor"}
                                />
                              </button>
                            ) : (
                              <button
                                onClick={(e) => setIsOpen(true)}
                                type="button"
                                className="rounded-full w-7 h-7 hover:bg-gray-light/50 flex items-center justify-center text-center"
                              >
                                <ChevronDown
                                  size={20}
                                  stroke={"currentColor"}
                                />
                              </button>
                            )}
                          </div>
                        )}
                    </InputAdornment>
                  ),
                }}
                sx={styleTextField}
              />
            );
          }}
        />
      </div>
    </>
  );
};

export default MyAutocomplete;