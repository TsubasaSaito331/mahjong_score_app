'use client';
import { IoPersonAdd } from 'react-icons/io5';
import { FaTrash } from 'react-icons/fa';
import { FaPen } from 'react-icons/fa6';
import { MdOutlinePlaylistAdd } from 'react-icons/md';
import Modal from '@/app/components/Modal';
import { useEffect, useState } from 'react';
import { deleteGame, registerGame } from '@/app/lib/actions';
import { GameResult, Player, Result } from '@/app/lib/definitions';
import { Button } from '../button';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export function Save({}: {}) {
  return <Button className="mt-4">保存</Button>;
}
