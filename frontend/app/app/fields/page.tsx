"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type Field = {
  id: string;
  fieldName: string;
  city: string;
  address: string;
};

const FieldsPage: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {    
    setTimeout(() => {
      const mockFields: Field[] = [
        {
          id: "1",
          fieldName: " המגרש של עובדיה",
          address: "עמק אילון 9",
          city: "מודיעין  ",
        },
        {
          id: "2",
          fieldName: "המגרש בשטחים",
          address: "דרך השלום 25",
          city: " נבי מוסא",
        },
        {
          id: "3",
          fieldName: "המתנחלים",
          address: "שדרות בן גוריון 12",
          city: " אום אל פחם",
        },
        {
          id: "4",
          fieldName: "מגרש ד",
          address: "רחוב הכרמל 5",
          city: "פתח תקווה",
        },
        {
          id: "5",
          fieldName: "מגרש ה",
          address: "ז'בוטינסקי 100",
          city: "רמת גן",
        },
        
      ];

      setFields(mockFields);
      setLoading(false);
    }, 1000);
  }, []);



  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-[#002366] text-2xl font-bold mb-4 mt-4 text-right">
        המגרשים שלך
      </h1>

      <div className="w-full flex flex-col items-center gap-6">
        {loading && (
          <div className="text-center text-gray-500">טוען מגרשים...</div>
        )}

        {!loading && fields.length === 0 && (
          <p className="rounded border bg-gray-50 py-8 text-center text-lg text-gray-500 shadow-sm w-full max-w-md">
            אין מגרשים להצגה
          </p>
        )}

        {!loading &&
          fields.length > 0 &&
          fields.map((field) => (
            <div
              key={field.id}
              className="rounded-[18px] bg-white shadow-lg p-6 w-full max-w-md mx-auto border border-blue-100"
            >              
              <div className="flex justify-start items-center mb-4">
                <img
                  src="/basketball-icon.png"
                  alt="basketball"
                  className="h-8 w-8 ml-3"
                />

                <div className="flex items-center text-right gap-1">
                    <span className="text-[#00aaff] font-bold text-lg">{field.fieldName}</span>
                    <span className="text-[#0077cc] font-bold text-lg">{field.city}</span>
                </div>
              </div>

              <Link
                href={`/field-manager/field/${field.id}/games`}
                className="block text-right text-[20px] font-bold text-purple-700 hover:underline"
              >
                לצפייה במשחקים
              </Link>

              <Link
                href={`/field-manager/field/${field.id}/edit`}
                className="block text-right text-[20px] font-bold text-black hover:underline mt-1"
              >
                שינוי פרטי המגרש
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FieldsPage;
