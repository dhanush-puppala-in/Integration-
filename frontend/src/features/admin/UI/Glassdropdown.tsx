import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

interface OptionObject {
    label: string | React.ReactNode;
    value: string;
}

type Option = string | OptionObject;

interface GlassDropdownProps {
    options: Option[];
    value: string | undefined | null;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function GlassDropdown({
    options,
    value,
    onChange,
    placeholder = "Select an option",
}: GlassDropdownProps): React.JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: Option) => {
        // If option is an object, pass its value. If string, pass the string.
        const val = typeof option === "object" && option !== null ? option.value : option as string;
        onChange(val);
        setIsOpen(false);
    };

    // Helper to get label and current selected value comparison
    const getLabel = (opt: Option): React.ReactNode => (typeof opt === "object" && opt !== null ? opt.label : opt);
    const getValue = (opt: Option): string => (typeof opt === "object" && opt !== null ? opt.value : opt as string);

    const selectedOption = options.find((opt) => getValue(opt) === value);
    const displayValue = selectedOption ? getLabel(selectedOption) : value || placeholder;

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* TRIGGER BUTTON */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
          w-full flex items-center justify-between px-4 py-3 
          bg-white/5 border border-white/10 rounded-xl 
          backdrop-blur-md text-white transition-all duration-200
          hover:bg-white/10 hover:border-white/20
          focus:outline-none focus:ring-2 focus:ring-indigo-500/50
          ${isOpen ? "ring-2 ring-indigo-500/50 bg-white/10" : ""}
        `}
            >
                <span className={`block truncate ${!value ? "text-white/50" : ""}`}>
                    {displayValue}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <FaChevronDown className="text-white/60 text-sm" />
                </motion.div>
            </button>

            {/* DROPDOWN MENU */}
            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="
              absolute z-50 mt-2 w-full max-h-60 overflow-auto 
              bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 
              rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]
              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-thumb]:bg-white/20
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-track]:bg-transparent
            "
                    >
                        {options.map((option, index) => {
                            const isSelected = getValue(option) === value;
                            return (
                                <li
                                    key={index}
                                    onClick={() => handleSelect(option)}
                                    className={`
                  cursor-pointer select-none relative py-3 pl-4 pr-9 
                  text-white/80 transition-all duration-200
                  hover:bg-white/10 hover:text-white hover:pl-6
                  ${isSelected
                                            ? "font-semibold bg-white/10 text-indigo-400"
                                            : "font-normal"
                                        }
                `}
                                >
                                    <span className="block truncate">{getLabel(option)}</span>
                                    {isSelected && (
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}