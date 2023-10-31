/* eslint-disable @typescript-eslint/no-use-before-define */
import { DndProvider, useDrop, useDrag } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ActionFunction, json, useFetcher } from 'remix'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  return json({ message: `You dropped ${formData.get('name')}` })
}

export default function Index() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="m-2">
        <h1 className="text-2xl font-bold">Remix Drag and Drop Example</h1>
        <div className="overflow-hidden clear-both">
          <Dustbin />
        </div>
        <div className="overflow-hidden clear-both">
          <Box name="Glass" />
          <Box name="Banana" />
          <Box name="Paper" />
        </div>
      </div>
    </DndProvider>
  )
}

const ItemTypes = {
  BOX: 'box',
}

function Dustbin() {
  const fetcher = useFetcher()

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: (item: DropResult) => {
      console.log(`You dropped ${item.name}`)
      fetcher.submit(
        { name: item.name },
        {
          method: 'post',
          action: '?index',
        },
      )

      return { name: 'Dustbin' }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  const isActive = canDrop && isOver
  let backgroundColor = 'bg-gray-700'
  if (isActive) {
    backgroundColor = 'bg-green-500'
  } else if (canDrop) {
    backgroundColor = 'bg-blue-500'
  }
  console.log(JSON.stringify(fetcher.submission?.formData.get('name'), null, 2))
  return (
    <div className="flex gap-4">
      <div
        ref={drop}
        role="Dustbin"
        className={`h-48 w-48 p-4 mr-6 mb-6 text-white float-left text-center ${backgroundColor}`}
      >
        {isActive ? 'Release to drop' : 'Drag a box here'}
      </div>
      <div>
        <p>
          {fetcher.state === 'submitting'
            ? `You dropped ${fetcher.submission.formData.get(
                'name',
              )} optimistically`
            : fetcher.data?.message}
        </p>
      </div>
    </div>
  )
}

export interface BoxProps {
  name: string
}

interface DropResult {
  name: string
}

function Box({ name }: BoxProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: { name },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()
      if (item && dropResult) {
        console.log(`You dropped ${item.name} into ${dropResult.name}!`)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))

  const opacity = isDragging ? 'opacity-40' : 'opacity-100'
  return (
    <div
      ref={drag}
      role="Box"
      className={`${opacity} border-dashed border border-gray-500 bg-white py-2 px-4 mr-6 mb-6 cursor-move float-left`}
      data-testid={`box-${name}`}
    >
      {name}
    </div>
  )
}
