export interface Addon {
  id: string;
  label: string;
  description: string;
  price: number;
  type: "checkbox" | "quantity";
  maxQuantity?: number;
}

export interface InstantState {
  selectedAddons: string[];
  extraPages: number;
  extraRevisions: number;
  extraProducts: number;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  leadCompany: string;
}

export const initialInstantState: InstantState = {
  selectedAddons: [],
  extraPages: 0,
  extraRevisions: 0,
  extraProducts: 0,
  leadName: "",
  leadEmail: "",
  leadPhone: "",
  leadCompany: "",
};
