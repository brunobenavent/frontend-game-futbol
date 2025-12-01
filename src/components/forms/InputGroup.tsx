// src/components/forms/InputGroup.tsx (CORREGIDO)

import React from 'react';
// Usamos import type para los tipos (esto ya lo arreglamos antes)
import type { UseFormRegister, FieldValues } from 'react-hook-form';

interface InputGroupProps {
    label: string;
    name: string;
    type: string;
    // 👇 FIX: Para que acepte cualquier forma de RHF sin conflicto genérico
    register: UseFormRegister<any>; 
    error?: string;
    placeholder?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, name, type, register, error, placeholder }) => (
    <div className="space-y-1">
        <label htmlFor={name} className="text-sm font-medium text-gray-300">
            {label}
        </label>
        <input
            id={name}
            type={type}
            className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white outline-none transition-colors 
                ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-green-500'}`}
            placeholder={placeholder}
            {...register(name)}
        />
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
);

export { InputGroup };