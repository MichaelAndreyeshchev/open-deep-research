'use client';

import * as React from 'react';
import { Tabs as MantineTabs } from '@mantine/core';
import { cn } from '@/lib/utils';

const Tabs = ({ children, ...props }: any) => <MantineTabs {...props}>{children}</MantineTabs>;

const TabsList = MantineTabs.List;

const TabsTrigger = MantineTabs.Tab;

const TabsContent = MantineTabs.Panel;

export { Tabs, TabsList, TabsTrigger, TabsContent };
