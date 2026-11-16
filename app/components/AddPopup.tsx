"use client"
import { useActionState, useState } from 'react';
import { SaveData } from './DataHandling';
import Link from 'next/link';
import FormField from './FormField';
import { X } from "lucide-react";

type ModalHandlerProps = {
  branches: string[];
};

export default function AddPopup({ branches }: ModalHandlerProps) {
  let editingId = 0;
  let error = null;
  const [state, formAction, isPending] = useActionState(SaveData, null);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

      <div className="bg-white rounded-xl w-full max-w-xl shadow-xl">

        <div className="p-5 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">
              {editingId !== null
                ? "Edit Phone Details"
                : "Add New Phone Number"}
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Enter phone and owner information
            </p>
          </div>

          <Link href="?" scroll={false}>
            <X size={20} />
          </Link>
        </div>
        <form action={formAction}>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Phone Number *">
              <input
                name="phone"
                placeholder="+91 XXXXX XXXXX"
                className="input-field"
              />
            </FormField>

            <FormField label="Manager Name *">
              <input
                name="manager"
                placeholder="Enter owner name"
                className="input-field"
              />
            </FormField>

            <FormField label="Email Address">
              <input
                type="email"

                name="email"
                placeholder="owner@company.com"
                className="input-field"
              />
            </FormField>

            <FormField label="Assign Branch Office *">
              <select
                className="input-field bg-white"
                name="branch"
              >
                {branches.map((branch, index) => (
                  <option key={branch} value={index}>
                    {branch}
                  </option>
                ))}
              </select>
            </FormField>

          </div>

          {error && (
            <p className="text-red-600 text-sm px-5">
              {error}
            </p>
          )}

          <div className="p-5 border-t flex justify-end gap-3">

            <button
              className="px-4 py-2 border rounded-lg text-sm"
            >
              Cancel
            </button>

            <button
              className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm"
            >
              Save Details
            </button>

          </div>
        </form>

      </div>
    </div>
  )
}