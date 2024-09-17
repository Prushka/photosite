import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {PropsWithChildren, ReactNode, useState} from "react";
import {cn} from "@/lib/utils";

export default function Toolover ({
                 content,
                 children,
                 className
             }: PropsWithChildren<{ content: string | ReactNode; className?: string }>) {
    const [open, setOpen] = useState(false);

    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip open={open}>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        className={cn('cursor-pointer', className)}
                        onClick={() => setOpen(!open)}
                        onMouseEnter={() => setOpen(true)}
                        onMouseLeave={() => setOpen(false)}
                    >
                        {children}
                    </button>
                </TooltipTrigger>
                <TooltipContent className={!content ? 'hidden' : ''}>
                    <span className="inline-block">{content}</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
