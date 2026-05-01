import { useState } from 'react'
import { X } from 'lucide-react'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { SearchInput } from './search-input'
import { useDebounce } from '@/hooks/useDebounce'

export type PickerOption = { id: number; label: string; sub?: string }

interface SearchPickerProps {
   value: PickerOption | null
   onChange: (value: PickerOption | null) => void
   searchPlaceholder: string
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   queryOptions: (term: string) => UseQueryOptions<any, any, PickerOption[]>
   className?: string
}

export function SearchPicker({ value, onChange, searchPlaceholder, queryOptions, className }: SearchPickerProps) {
   const [inputValue, setInputValue] = useState('')
   const debouncedTerm = useDebounce(inputValue, 300)
   const { data: results = [] } = useQuery(queryOptions(debouncedTerm))

   const showDropdown = value === null && inputValue.length >= 2

   function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
         setInputValue('')
      }
   }

   function handleSelect(opt: PickerOption) {
      onChange(opt)
      setInputValue('')
   }

   if (value !== null) {
      return (
         <div className={cn(
            'inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-primary/40 bg-primary/5 text-sm min-w-0',
            className,
         )}>
            <span className="font-medium text-primary truncate max-w-35">{value.label}</span>
            {value.sub && (
               <span className="text-xs text-muted-foreground shrink-0">{value.sub}</span>
            )}
            <button
               onClick={() => onChange(null)}
               className="ml-0.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
               <X className="size-3.5" />
            </button>
         </div>
      )
   }

   return (
      <div
         className={cn('relative', className)}
         tabIndex={-1}
         onBlur={handleBlur}
      >
         <SearchInput
            value={inputValue}
            onChange={setInputValue}
            placeholder={searchPlaceholder}
            className="w-full"
         />
         {showDropdown && (
            <div className="absolute z-50 top-full mt-1 w-full min-w-50 rounded-md border border-border bg-popover shadow-md overflow-hidden">
               {results.length === 0 ? (
                  <p className="px-3 py-2.5 text-sm text-muted-foreground">Niciun rezultat.</p>
               ) : (
                  results.map(opt => (
                     <button
                        key={opt.id}
                        onMouseDown={e => { e.preventDefault(); handleSelect(opt) }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted/60 transition-colors flex flex-col gap-0.5"
                     >
                        <span className="font-medium text-foreground">{opt.label}</span>
                        {opt.sub && (
                           <span className="text-xs text-muted-foreground">{opt.sub}</span>
                        )}
                     </button>
                  ))
               )}
            </div>
         )}
      </div>
   )
}
