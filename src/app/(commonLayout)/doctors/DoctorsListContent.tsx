"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Stethoscope, Star, MapPin, DollarSign, Search, Filter } from "lucide-react";
import { IDoctor, ISpecialty, IMeta } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";

interface DoctorsListContentProps {
  doctors: IDoctor[];
  specialties: ISpecialty[];
  meta?: IMeta;
  initialFilters: {
    specialty: string;
    search: string;
  };
}

export function DoctorsListContent({
  doctors,
  specialties,
  meta,
  initialFilters,
}: DoctorsListContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialFilters.search);
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialFilters.specialty);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedSpecialty) params.set("specialty", selectedSpecialty);
    router.push(`/doctors?${params.toString()}`);
  };

  const handleSpecialtyChange = (specialtyId: string) => {
    setSelectedSpecialty(specialtyId);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (specialtyId) params.set("specialty", specialtyId);
    router.push(`/doctors?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/doctors?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
            Find Your Doctor
          </h1>
          <p className="text-white/80 text-center mt-2">
            Browse our network of qualified healthcare professionals
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto">
            <div className="flex gap-2 bg-white p-2 rounded-lg shadow-lg">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, specialty..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-0 shadow-none"
                />
              </div>
              <Button type="submit">Search</Button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter by Specialty
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleSpecialtyChange("")}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      !selectedSpecialty
                        ? "bg-primary text-white"
                        : "hover:bg-muted"
                    }`}
                  >
                    All Specialties
                  </button>
                  {specialties.map((specialty) => (
                    <button
                      key={specialty.id}
                      onClick={() => handleSpecialtyChange(specialty.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedSpecialty === specialty.id
                          ? "bg-primary text-white"
                          : "hover:bg-muted"
                      }`}
                    >
                      {specialty.title}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Doctors Grid */}
          <div className="flex-1">
            {doctors.length === 0 ? (
              <EmptyState
                icon={<Stethoscope className="h-12 w-12" />}
                title="No doctors found"
                description="Try adjusting your search or filter criteria."
                action={
                  <Button onClick={() => router.push("/doctors")}>
                    Clear Filters
                  </Button>
                }
              />
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-muted-foreground">
                    Showing {doctors.length} of {meta?.total || 0} doctors
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {doctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={meta.page}
                      totalPages={meta.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DoctorCard({ doctor }: { doctor: IDoctor }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {/* Doctor Image */}
        <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden">
          {doctor.profilePhoto ? (
            <img
              src={doctor.profilePhoto}
              alt={doctor.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Stethoscope className="h-16 w-16 text-primary/40" />
          )}
        </div>

        {/* Doctor Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg">Dr. {doctor.name}</h3>
          <p className="text-sm text-muted-foreground">{doctor.designation}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="font-medium">{doctor.averageRating?.toFixed(1) || "0.0"}</span>
            <span className="text-sm text-muted-foreground">
              ({doctor.review?.length || 0} reviews)
            </span>
          </div>

          {/* Specialties */}
          {doctor.doctorSpecialties && doctor.doctorSpecialties.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {doctor.doctorSpecialties.slice(0, 2).map((ds) => (
                <Badge key={ds.specialtyId} variant="secondary" className="text-xs">
                  {ds.specialty?.title}
                </Badge>
              ))}
              {doctor.doctorSpecialties.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{doctor.doctorSpecialties.length - 2} more
                </Badge>
              )}
            </div>
          )}

          {/* Meta Info */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>${doctor.appointmentFee}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate max-w-[100px]">
                {doctor.currentWorkingPlace || "N/A"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            <Link href={`/doctors/${doctor.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </Link>
            <Link href={`/consultation?doctor=${doctor.id}`} className="flex-1">
              <Button className="w-full">Book</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
