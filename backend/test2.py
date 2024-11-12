import asyncio

async def process_items(events, index):
    print(f"Task {index} started")

    # 等待所有事件被设置
    await asyncio.gather(*(event.wait() for event in events))
    print(f"Task {index} processing")
    await asyncio.sleep(1)  # 模拟处理时间
    print(f"Task {index} finished")

    # 设置事件，通知其他任务可以开始执行
    # for event in events:
    #     event.set()

async def main():
    # 创建 3 个事件
    events = [asyncio.Event() for _ in range(3)]
    evt1 = [events[0], events[1]]
    evt2 = [events[1]]
    evt3 = [events[1], events[2]]

    # 启动任务
    task1 = asyncio.create_task(process_items(evt1, 1))
    task2 = asyncio.create_task(process_items(evt2, 2))
    task3 = asyncio.create_task(process_items(evt3, 3))

    # 设置初始事件，启动任务
    for event in events:
        event.set()
        await asyncio.sleep(1)

    # 等待所有任务完成
    await asyncio.gather(task1, task2, task3)

if __name__ == "__main__":
    asyncio.run(main())