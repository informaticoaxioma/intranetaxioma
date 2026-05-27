<?php

namespace App\Services;

use App\Models\Event;

class EventService
{
    public function getAll()
    {
        return Event::latest()->get();
    }

    public function create(array $data)
    {
        return Event::create($data);
    }

    public function update(Event $event, array $data)
    {
        $event->update($data);

        return $event;
    }

    public function delete(Event $event)
    {
        return $event->delete();
    }
}