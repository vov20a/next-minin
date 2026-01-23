'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, Button, ModalFooter } from '@heroui/react';
import React from 'react';
import { ReactNode } from 'react';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  maxHeight?: string;
  minHeight?: string;
  showFooter?: boolean;
}

export default function CustomModal({
  isOpen,
  onClose,
  maxHeight,
  minHeight,
  title,
  children,
  size = 'xs',
  showFooter = false,
}: IProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      className={maxHeight ?? '' + minHeight}
      placement="center"
    >
      <ModalContent>
        <ModalHeader className="border-b">
          <h3 className="text-xl text-background font-semibold">{title}</h3>
        </ModalHeader>
        <ModalBody className="space-y-4 py-6">{children}</ModalBody>
        {showFooter && (
          <ModalFooter>
            <Button className="border-1" color="default" variant="light" onPress={onClose}>
              Закрыть
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
