"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const values = [
    "Deckenschiene MQ-41 120m plus Befestigungszubehör:",
    "Rohrschelle kpl. mit GRG + Grundplatte MP-MI 2 1/2\"",
    "Rohrschelle kpl. mit GRG + Grundplatte MP-MI 3\"",
    "Rohrschelle kpl. mit GRG + Grundplatte MP-MI 4\"",
    "Rohrschelle kpl. mit GRG + Grundplatte MP-MI 5\"",
    "Rohrschelle kpl. mit GRG + Grundplatte MP-MI 6\"",
    "Rohrschelle kpl. mit GRG + Grundplatte MP-U-I 1/2\"",
    "Rohrschelle kpl. mit GRG + Grundplatte MP-U-I 25-29 3/4\" M8/10/½\"",
    "Rohrschelle kpl. mit GRG + Grundplatte MP-U-I 29-33 1\" M8/10/½\"",
    "Rohrschelle kpl. mit GRG + Grundplatte MP-U-I 3/8\"",
    "Rohrschelle kpl. mit GRG + Grundplatte MP-U-I 42-47 1 ¼\" M8/10/½\"",
    "Rohrschelle kpl. mit GRG + Grundplatte MP-U-I 47-52 1 ½\" M8/10/½\"",
    "Rohrschelle kpl. mit GRG + Grundplatte MP-U-I 62-67 2\" M8/10/½\"",
    "Rohrschelle kpl. mit GRG + Grundplatte MP-U-I 72-77 2 ½\" M8/10/½\"",
    "Rohrschelle kpl. mit Grundplatte MP-L-I 1 1/2\"",
    "Rohrschelle kpl. mit Grundplatte MP-L-I 1 1/4\"",
    "Rohrschelle kpl. mit Grundplatte MP-L-I 1\"",
    "Rohrschelle kpl. mit Grundplatte MP-L-I 1/2\"",
    "Rohrschelle kpl. mit Grundplatte MP-L-I 2 1/2\"",
    "Rohrschelle kpl. mit Grundplatte MP-L-I 2\"",
    "Rohrschelle kpl. mit Grundplatte MP-L-I 3\"",
    "Rohrschelle kpl. mit Grundplatte MP-L-I 3/4\"",
    "Rohrschelle kpl. mit Grundplatte MP-L-I 3/8\"",
    "Rohrschelle kpl. mit Grundplatte MP-L-I 4\"",
    "Rohrschelle kpl. mit Grundplatte MP-L-I 5\"",
    "Rohrschelle kpl. mit Grundplatte MPN-RC 110mm",
    "Rohrschelle kpl. mit Grundplatte MPN-RC 63mm",
    "Rohrschelle kpl. mit Grundplatte MPN-RC 75mm",
    "Rohrschelle kpl. mit Grundplatte MPN-RC 90mm",
    "Rohrschelle kpl. mit HKD MP-L-I 1 1/4\"",
    "Rohrschelle kpl. mit HKD MP-L-I 1\"",
    "Rohrschelle kpl. mit HKD MP-L-I 3/4\"",
    "Wand-Wand Konstruktion MQ-72 Typ B16 inkl. Wandfuss, Schraubmaterial und Dübel L=300 cm",
    "Wand-Wand Konstruktion MQ-72 Typ B16 inkl. Wandfuss, Schraubmaterial und Dübel L=400 cm"
];

// onSelect prop
interface ComboboxProps {
    onSelect: (value: string) => void
    readOnly?: boolean
}

export function Combobox(props: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-2/3 justify-between overflow-hidden"
          disabled={props.readOnly}
        >
          {value || "Select..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-2/3 p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {values.map((hiltiValue) => (
                <CommandItem
                  key={hiltiValue}
                  value={hiltiValue}
                  onSelect={(currentValue) => {
                    setValue(currentValue)
                    props.onSelect(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      hiltiValue === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {hiltiValue}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
