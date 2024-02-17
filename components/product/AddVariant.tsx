import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, InputProps } from "@/components/ui/input";
import { Plus, PlusCircle, Trash2Icon, XIcon } from "lucide-react";
import { Dispatch, SetStateAction, forwardRef, useState } from "react";
import { ProductWithVariants } from "./AddProductForm";

type InputTagsProps = InputProps & {
  valueOne: string[];
  valueTwo: string[];
  titleOne: (val: string) => void;
  titleTwo: (val: string) => void;
  onChangeOne: Dispatch<SetStateAction<string[]>>;
  onChangeTwo: Dispatch<SetStateAction<string[]>>;
  product?: ProductWithVariants | null;
};

export const AddVariant = forwardRef<HTMLInputElement, InputTagsProps>(
  (
    {
      product,
      valueOne,
      valueTwo,
      titleOne,
      titleTwo,
      onChangeOne,
      onChangeTwo,
      ...props
    },
    ref
  ) => {
    const [pendingDataPointOne, setPendingDataPointOne] = useState("");
    const [pendingDataPointTwo, setPendingDataPointTwo] = useState("");
    const [optionOneTitle, setOptionOneTitle] = useState("");
    const [optionTwoTitle, setOptionTwoTitle] = useState("");
    const [openAddVariant, setOpenAddVariant] = useState(false);
    const [openAddSecVariant, setOpenAddSecVariant] = useState(false);

    const addPendingDataPointOne = () => {
      if (pendingDataPointOne) {
        const newDataPoints = new Set([...valueOne, pendingDataPointOne]);
        onChangeOne(Array.from(newDataPoints));
        setPendingDataPointOne("");
      }
    };
    const addPendingDataPointTwo = () => {
      if (pendingDataPointTwo) {
        const newDataPoints = new Set([...valueTwo, pendingDataPointTwo]);
        onChangeTwo(Array.from(newDataPoints));
        setPendingDataPointTwo("");
      }
    };

    const handleInputChangeOne = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const newValue = event.target.value;
      setOptionOneTitle(newValue);
      titleOne(newValue);
    };
    const handleInputChangeTwo = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const newValue = event.target.value;
      setOptionTwoTitle(newValue);
      titleTwo(newValue);
    };
    return (
      <div>
        {openAddVariant ? (
          <div>
            <label htmlFor="optionOneTitle" className="text-sm">
              Option name
            </label>
            <div className="mb-5 mt-3">
              <div className="flex items-center mb-5">
                <Input
                  id="optionOneTitle"
                  value={optionOneTitle}
                  onChange={handleInputChangeOne}
                />
                <Button type="button" variant={"outline"} className="ml-3">
                  <Trash2Icon
                    className="h-4 w-4"
                    onClick={() => setOpenAddVariant(!openAddVariant)}
                  />
                </Button>
              </div>
              <label htmlFor="optionOneTitle" className="text-sm">
                Option Value(s)
              </label>
              <div className="flex my-3">
                <Input
                  value={pendingDataPointOne}
                  onChange={(e) => setPendingDataPointOne(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPendingDataPointOne();
                    } else if (e.key === "," || e.key === " ") {
                      e.preventDefault();
                      addPendingDataPointOne();
                    }
                  }}
                  {...props}
                  ref={ref}
                />
                <Button
                  variant={"outline"}
                  type="button"
                  className="ml-3"
                  onClick={addPendingDataPointOne}
                >
                  <PlusCircle className="w-4 h-4" />
                </Button>
              </div>
              <div className="border rounded-md h-[6rem] overflow-y-auto p-1 flex gap-2 flex-wrap w-2/3 ">
                {valueOne.map((item, idx) => (
                  <Badge key={idx} variant="secondary" className="h-fit">
                    {item}
                    <button
                      type="button"
                      className="w-3 ml-2"
                      onClick={() => {
                        onChangeOne(valueOne.filter((i) => i !== item));
                      }}
                    >
                      <XIcon className="w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            {!openAddSecVariant && (
              <Button
                type="button"
                variant={"link"}
                onClick={() => setOpenAddSecVariant(!openAddSecVariant)}
                className="text-sky-600 hover:text-sky-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add another variant
              </Button>
            )}

            {openAddSecVariant && (
              <div>
                <label htmlFor="optionOneTitle" className="text-sm">
                  Option name
                </label>
                <div className="mb-5 mt-3">
                  <div className="flex items-center mb-5">
                    <Input
                      value={optionTwoTitle}
                      onChange={handleInputChangeTwo}
                    />
                    <Button type="button" variant={"outline"} className="ml-3">
                      <Trash2Icon
                        className="h-4 w-4"
                        onClick={() => setOpenAddSecVariant(!openAddSecVariant)}
                      />
                    </Button>
                  </div>
                </div>
                <label htmlFor="optionOneTitle" className="text-sm">
                  Option Value(s)
                </label>
                <div className="flex my-3">
                  <Input
                    value={pendingDataPointTwo}
                    onChange={(e) => setPendingDataPointTwo(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addPendingDataPointTwo();
                      } else if (e.key === "," || e.key === " ") {
                        e.preventDefault();
                        addPendingDataPointTwo();
                      }
                    }}
                    className="rounded-r-none"
                    {...props}
                    ref={ref}
                  />
                  <Button
                    variant={"outline"}
                    type="button"
                    className="ml-3"
                    onClick={addPendingDataPointTwo}
                  >
                    <PlusCircle className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-md h-[6rem] overflow-y-auto p-1 flex gap-2 flex-wrap w-2/3 ">
                  {valueTwo.map((item, idx) => (
                    <Badge key={idx} variant="secondary" className="h-fit">
                      {item}
                      <button
                        type="button"
                        className="w-3 ml-2"
                        onClick={() => {
                          onChangeTwo(valueTwo.filter((i) => i !== item));
                        }}
                      >
                        <XIcon className="w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <Button
              type="button"
              variant={"link"}
              onClick={() => setOpenAddVariant(!openAddVariant)}
              className="text-sky-600 hover:text-sky-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add a variant like size or color
            </Button>
          </div>
        )}
      </div>
    );
  }
);
AddVariant.displayName = "AddVariant";
