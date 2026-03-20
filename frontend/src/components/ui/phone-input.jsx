import React, { useState } from 'react';
import { Label } from './label';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

export function PhoneInput({ 
  label,
  countryCode = "+1",
  phoneNumber = "",
  onCountryCodeChange,
  onPhoneNumberChange,
  phoneCodes = [],
  required = false,
  disabled = false
}) {
  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="flex gap-2">
        <Select 
          value={countryCode} 
          onValueChange={onCountryCodeChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {phoneCodes.map((pc) => (
              <SelectItem key={pc.code} value={pc.code}>
                {pc.code} ({pc.country})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="tel"
          value={phoneNumber}
          onChange={(e) => {
            // Only allow numbers and limit to 12 digits
            const value = e.target.value.replace(/\D/g, '').slice(0, 12);
            onPhoneNumberChange(value);
          }}
          placeholder="Phone number"
          required={required}
          disabled={disabled}
          maxLength={12}
          className="flex-1"
        />
      </div>
    </div>
  );
}
