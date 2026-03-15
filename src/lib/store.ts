import { useState, useCallback } from "react";
import { Student, Allocation, HALLS } from "./constants";

// Generate mock data
function generateMockData() {
  const students: Student[] = [];
  const allocations: Allocation[] = [];

  const names = [
    "राहुल पाटील", "प्रिया शर्मा", "अमित जाधव", "सुनीता देशमुख",
    "विकास मोरे", "अनिता कुलकर्णी", "सचिन गायकवाड", "मेघना जोशी",
    "रोहित चव्हाण", "पूजा भोसले", "अजय पवार", "स्वाती नलावडे",
    "किरण साळुंखे", "रश्मी वाघमारे", "संदीप शिंदे", "नेहा कदम",
    "गौरव राणे", "दीपा इंगळे", "मंदार फडके", "सारिका तांबे",
  ];

  const today = new Date();
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  let studentIndex = 0;

  HALLS.forEach((hall) => {
    const occupiedCount = Math.floor(hall.desks * 0.6);
    const expiredCount = Math.floor(hall.desks * 0.1);

    for (let desk = 1; desk <= occupiedCount + expiredCount && desk <= hall.desks; desk++) {
      const isExpired = desk > occupiedCount;
      const name = names[studentIndex % names.length];
      const studentId = `student-${hall.id}-${desk}`;

      students.push({
        id: studentId,
        full_name: name,
        mobile_number: `98${String(studentIndex).padStart(8, "0")}`,
        status: isExpired ? "expired" : "active",
        created_at: new Date(today.getFullYear(), today.getMonth() - 2, 1).toISOString(),
      });

      allocations.push({
        id: `alloc-${hall.id}-${desk}`,
        student_id: studentId,
        hall_name: hall.id,
        desk_number: desk,
        start_date: new Date(today.getFullYear(), today.getMonth(), 1).toISOString(),
        end_date: isExpired ? lastMonth.toISOString() : endOfMonth.toISOString(),
        active: true,
      });

      studentIndex++;
    }
  });

  return { students, allocations };
}

const initialData = generateMockData();

let globalStudents = [...initialData.students];
let globalAllocations = [...initialData.allocations];
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((l) => l());
}

export function useStore() {
  const [, setTick] = useState(0);

  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

  useState(() => {
    listeners.push(forceUpdate);
    return () => {
      listeners = listeners.filter((l) => l !== forceUpdate);
    };
  });

  const addStudent = useCallback(
    (data: { full_name: string; mobile_number: string; pin?: string; hall_name: string; desk_number: number }) => {
      const today = new Date();
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const studentId = `student-${Date.now()}`;

      const student: Student = {
        id: studentId,
        full_name: data.full_name,
        mobile_number: data.mobile_number,
        pin: data.pin,
        status: "active",
        created_at: today.toISOString(),
      };

      const allocation: Allocation = {
        id: `alloc-${Date.now()}`,
        student_id: studentId,
        hall_name: data.hall_name,
        desk_number: data.desk_number,
        start_date: today.toISOString(),
        end_date: endOfMonth.toISOString(),
        active: true,
      };

      globalStudents = [...globalStudents, student];
      globalAllocations = [...globalAllocations, allocation];
      notify();
    },
    []
  );

  const renewStudent = useCallback((studentId: string) => {
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    globalStudents = globalStudents.map((s) =>
      s.id === studentId ? { ...s, status: "active" as const } : s
    );
    globalAllocations = globalAllocations.map((a) =>
      a.student_id === studentId && a.active
        ? { ...a, start_date: today.toISOString(), end_date: endOfMonth.toISOString() }
        : a
    );
    notify();
  }, []);

  const markStudentLeft = useCallback((studentId: string) => {
    globalStudents = globalStudents.map((s) =>
      s.id === studentId ? { ...s, status: "inactive" as const } : s
    );
    globalAllocations = globalAllocations.map((a) =>
      a.student_id === studentId ? { ...a, active: false } : a
    );
    notify();
  }, []);

  return {
    students: globalStudents,
    allocations: globalAllocations,
    addStudent,
    renewStudent,
    markStudentLeft,
  };
}
