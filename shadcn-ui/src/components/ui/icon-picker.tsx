import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Smile } from 'lucide-react';

interface IconPickerProps {
    value: string;
    onChange: (icon: string) => void;
    className?: string;
}

const iconCategories = [
    {
        name: 'Phổ biến',
        icons: ['🍔', '🛒', '🚗', '🏠', '💰', '🎮', '✈️', '💊', '🎁', '📚']
    },
    {
        name: 'Ăn uống',
        icons: ['🍔', '🍕', '🌭', '🥪', '🌮', '🍜', '🍱', '🍚', '🥖', '🥦', '🍎', '🥕', '🍦', '🍩', '☕', '🍺', '🍷', '🍹']
    },
    {
        name: 'Di chuyển',
        icons: ['🚗', '🚕', '🚌', '🚑', '🚓', '🚲', '🛵', '🚂', '✈️', '🚀', '⛽', '🚧', '🗺️']
    },
    {
        name: 'Gia đình & Nhà cửa',
        icons: ['🏠', '🏡', '🏢', '🛏️', '🛋️', '🚿', '🚽', '💡', '🔌', '🔨', '🧹', '🧺', '👶', '🐶', '🐱']
    },
    {
        name: 'Cá nhân & Sức khỏe',
        icons: ['👕', '👖', '👗', '👟', '🕶️', '💄', '💊', '💉', '🏥', '🧘', '💇', '💅', '🏋️']
    },
    {
        name: 'Giải trí & Mua sắm',
        icons: ['🎮', '🎬', '🎵', '📺', '📷', '🎨', '🛒', '🛍️', '🎁', '🎫', '🏝️', '🎪']
    },
    {
        name: 'Tài chính & Công việc',
        icons: ['💰', '💵', '💳', '💸', '🏦', '💼', '📊', '📈', '📎', '📱', '💻', '🎓']
    }
];

export function IconPicker({ value, onChange, className }: IconPickerProps) {
    const [open, setOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(iconCategories[0].name);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-16 h-16 text-3xl p-0 rounded-xl border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all",
                        className
                    )}
                >
                    {value || <Smile className="w-6 h-6 text-gray-400" />}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[90vw] sm:w-80 p-0" align="start">
                <div className="flex w-full border-b overflow-x-auto p-2 gap-2 scroll-smooth" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}>
                    {iconCategories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => setActiveCategory(cat.name)}
                            className={cn(
                                "px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors flex-shrink-0",
                                activeCategory === cat.name
                                    ? "bg-emerald-100 text-emerald-700 font-medium"
                                    : "text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
                <ScrollArea className="h-64 p-4">
                    <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                        {iconCategories
                            .find((c) => c.name === activeCategory)
                            ?.icons.map((icon) => (
                                <button
                                    key={icon}
                                    onClick={() => {
                                        onChange(icon);
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        "w-10 h-10 text-2xl flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors",
                                        value === icon && "bg-emerald-100 ring-2 ring-emerald-500 ring-offset-1"
                                    )}
                                >
                                    {icon}
                                </button>
                            ))}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
