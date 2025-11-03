
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  colors: Record<string, string>;
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

// List of colors that should have white text
const darkColors = ['#184482', '#7B93FF', '#DB78FF', '#831A1C', '#3B711C'].map(color => color.toLowerCase());

// Helper function to determine text color based on the background color
export const shouldUseWhiteText = (hexColor: string): boolean => {
  return darkColors.includes(hexColor.toLowerCase());
};

const ColorPicker = ({ colors, selectedColor, onSelectColor }: ColorPickerProps) => {
  return (
    <div className="grid grid-cols-5 gap-2">
      {Object.entries(colors).map(([name, hexValue]) => {
        // Ensure proper comparison by normalizing hexValue
        const isSelected = selectedColor.toLowerCase() === hexValue.toLowerCase();
        
        return (
          <button
            key={name}
            className={cn(
              "w-10 h-10 rounded-full border border-border flex items-center justify-center cursor-pointer",
              isSelected && "ring-2 ring-offset-2 ring-primary"
            )}
            style={{ backgroundColor: hexValue }}
            onClick={() => onSelectColor(hexValue)}
            title={name.replace(/-/g, " ")}
            type="button"
          >
            {isSelected && (
              <Check className={`h-4 w-4 ${shouldUseWhiteText(hexValue) || hexValue.toLowerCase() === '#ffffff' ? 'text-white' : 'text-black'} drop-shadow`} />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ColorPicker;
