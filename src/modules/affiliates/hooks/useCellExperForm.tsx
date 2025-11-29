/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FormEvent, useEffect, useState } from 'react'
import { http } from '@/core/utils/http_request';

interface Config {
    id: number;
    affiliate: string;
    origin: string;
    referer: string;
  }

  
export default function useCellExperForm(
    onSuccess: () => void,
    onError: (message: string) => void
) {

      const [configs, setConfigs] = useState<Config[]>([]);
      const [selectedConfig, setSelectedConfig] = useState<string>("");
      const [urlBase, setUrlBase] = useState("");
      const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
      const [loading, setLoading] = useState(false);
      const [success, setSuccess] = useState(false);
    
      useEffect(() => {
        http.get("config-brokers")
          .then(res => {
            if (res.data.success) setConfigs(res.data.data);
          })
          .catch(console.error);
      }, []);
    
      const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSelectedConfig(val);
    
        if (val === "custom") {
          setUrlBase("");
        } else {
          const cfg = configs.find(c => c.id.toString() === val);
          setUrlBase(cfg ? cfg.origin : "");
        }
      };
    
      const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
          await http.post("accounts/create", {
            login_ce: username,
            password_ce: password,
            url_base: urlBase,
            config_id: selectedConfig === "custom" ? null : selectedConfig,
          });
          setSuccess(true);
          onSuccess(); // trigger parent callback
    
          if (selectedConfig === "custom") setUrlBase("");
          setUsername("");
          setPassword("");
        } catch (err: any) {
          onError(err.response?.data?.message || "Something went wrong.");
        } finally {
          setLoading(false);
          setTimeout(() => setSuccess(false), 3000);
        }
      };
    
  return {
    configs,
    selectedConfig,
    urlBase,
    username,
    password,
    loading,
    success,
    setSelectedConfig,
    setUrlBase,
    setUsername,
    setPassword,
    handleSelect,
    handleSubmit
  }
}
