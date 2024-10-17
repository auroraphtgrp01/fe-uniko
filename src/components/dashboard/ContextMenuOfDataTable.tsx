// import { IButtonInDataTableHeader } from '@/types/core.i'
// import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'

// export const ContextMenuOfDataTable = ({
//   contextMenuPosition,
//   setContextMenuPosition,
//   buttonContextMenu
// }: {
//   contextMenuPosition: { x: number; y: number } | null
//   setContextMenuPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>
//   buttonContextMenu: IButtonInDataTableHeader[]
// }) => {
//   return contextMenuPosition &&  (
//     <DropdownMenu open={!!contextMenuPosition} onOpenChange={() => setContextMenuPosition(null)}>
//       <DropdownMenuTrigger asChild>
//         <div style={{ position: 'absolute', top: contextMenuPosition.y, left: contextMenuPosition.x }} />
//       </DropdownMenuTrigger>
//       <DropdownMenuContent>
//         <DropdownMenuCheckboxItem onClick={() => handleActionOne(selectedRowData)}>Action 1</DropdownMenuCheckboxItem>
//         <DropdownMenuCheckboxItem onClick={() => handleActionTwo(selectedRowData)}>Action 2</DropdownMenuCheckboxItem>
//         {/* Thêm các tùy chọn khác tại đây */}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }
