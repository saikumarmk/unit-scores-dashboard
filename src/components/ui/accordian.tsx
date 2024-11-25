import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = AccordionPrimitive.Item;

export const AccordionTrigger = ({ children, className, ...props }: any) => (
  <AccordionPrimitive.Trigger
    className={cn("cursor-pointer text-lg font-medium", className)}
    {...props}
  >
    {children}
  </AccordionPrimitive.Trigger>
);

export const AccordionContent = ({ children, className, ...props }: any) => (
  <AccordionPrimitive.Content
    className={cn("overflow-hidden text-sm text-gray-700", className)}
    {...props}
  >
    {children}
  </AccordionPrimitive.Content>
);
