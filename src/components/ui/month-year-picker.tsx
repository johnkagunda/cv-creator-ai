import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type DateValue = string; // YYYY-MM-DD



export function dateToLabel(value: DateValue) {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  const year = Number(y);
  const monthIndex = Number(m) - 1;
  const day = Number(d);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(monthIndex) ||
    !Number.isFinite(day) ||
    monthIndex < 0 ||
    monthIndex > 11 ||
    day < 1 ||
    day > 31
  ) {
    return '';
  }

  return new Date(year, monthIndex, day).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export interface MonthYearPickerProps {
  value: DateValue;
  onChange: (value: DateValue) => void;
  placeholder?: string;
  disabled?: boolean;
}

function getDateFromDate(d: Date): DateValue {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function MonthYearPicker({
  value,
  onChange,
  placeholder = 'Select date',
  disabled,
}: MonthYearPickerProps) {
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    const [y, m, d] = value.split('-');
    const year = Number(y);
    const monthIndex = Number(m) - 1;
    const day = Number(d);
    if (!Number.isFinite(year) || !Number.isFinite(monthIndex) || !Number.isFinite(day)) return undefined;
    return new Date(year, monthIndex, day);
  }, [value]);


  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="w-full justify-start gap-2 bg-card"
        >
          <CalendarIcon className="h-4 w-4 opacity-70" />
          <span className={value ? '' : 'text-muted-foreground'}>
            {value ? dateToLabel(value) : placeholder}

          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            // Calendar renders day-level UI; we convert selection to month+year.
            // We also close after selection.
            onSelect={(d) => {
              if (!d) return;
              onChange(getDateFromDate(d));

              setOpen(false);
            }}
            initialFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

