import { useState } from "react";
import { http } from "@/core/utils/http_request";

// Formulario para agregar un subafiliado
export function AddSubAffiliateForm({ onSuccess }: { onSuccess: () => void }) {
    const [formData, setFormData] = useState({
      Admin_id: '',
      Subaffiliate_id: '',
    });
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await http.post('subaffiliates', formData);
        onSuccess();
      } catch (err) {
        console.error('Error creating subaffiliate:', err);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="Admin_id" placeholder="Admin ID" onChange={handleChange} className="input" required />
        <input name="Subaffiliate_id" placeholder="Subaffiliate ID" onChange={handleChange} className="input" required />
        <button type="submit" className="btn">Add SubAffiliate</button>
      </form>
    );
  }
  