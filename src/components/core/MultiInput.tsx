import React from 'react'
import { TagInput, Tag } from 'emblor'

export default function MultiInput({ defaultValue, onValueChange, props }: any) {
  const [valueTags, setValueTags] = React.useState<Tag[]>(
    defaultValue?.map((v: any, index: number) => ({ id: index, text: v })) ?? []
  )
  const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(null)
  return (
    <div>
      <TagInput
        tags={valueTags}
        placeholder={props?.placeholder}
        setTags={(newTags: any) => {
          setValueTags(newTags)
          onValueChange(newTags.map((item: any) => item.text))
        }}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
        {...props}
      />
    </div>
  )
}
