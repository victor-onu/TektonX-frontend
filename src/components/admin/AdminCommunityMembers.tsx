import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import communityMemberService from '@/services/communityMemberService'
import { useToast } from '@/hooks/useToast'
import { formatDate } from '@/lib/utils'
import { NIGERIAN_STATES } from '@/lib/nigerian-states'

export default function AdminCommunityMembers() {
  const { toast } = useToast()

  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState('all')
  const [exporting, setExporting] = useState(false)

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['admin-community-members'],
    queryFn: communityMemberService.getAll,
  })

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase()
    return members.filter((member) => {
      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query)
      const matchesState = stateFilter === 'all' || member.state === stateFilter
      return matchesSearch && matchesState
    })
  }, [members, search, stateFilter])

  async function handleExport() {
    setExporting(true)
    try {
      const blob = await communityMemberService.export()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'tektonx-community-members.csv'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Community members exported as CSV.')
    } catch {
      toast.error('Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl text-white">COMMUNITY MEMBERS</h2>
          <p className="mt-1 text-sm text-white/50">
            People who signed up to join the TektonX community.
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || members.length === 0}
          className="inline-flex items-center gap-2 rounded-lg border border-tekton-green/30 bg-tekton-green/10 px-4 py-2.5 text-sm font-medium text-tekton-green smooth-hover hover:bg-tekton-green/20 transition-colors disabled:opacity-50"
        >
          <Download className="size-4" />
          {exporting ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 sm:max-w-xs"
        />
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white sm:w-56">
            <SelectValue placeholder="Filter by state" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-white/10 max-h-64">
            <SelectItem value="all" className="text-white hover:bg-white/10">
              All States
            </SelectItem>
            {NIGERIAN_STATES.map((s) => (
              <SelectItem key={s} value={s} className="text-white hover:bg-white/10">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col divide-y divide-white/5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="h-4 w-32 rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-40 rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-28 rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-24 rounded bg-white/10 animate-pulse ml-auto" />
              </div>
            ))}
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-white/40">
              {members.length === 0 ? 'No community members yet.' : 'No members match your filters.'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/50 text-xs uppercase tracking-wider">Name</TableHead>
                <TableHead className="text-white/50 text-xs uppercase tracking-wider">Email</TableHead>
                <TableHead className="text-white/50 text-xs uppercase tracking-wider">Phone</TableHead>
                <TableHead className="text-white/50 text-xs uppercase tracking-wider">State</TableHead>
                <TableHead className="text-white/50 text-xs uppercase tracking-wider">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id} className="border-white/5 hover:bg-white/[0.03]">
                  <TableCell className="font-medium text-white">{member.name}</TableCell>
                  <TableCell className="text-white/70">{member.email}</TableCell>
                  <TableCell className="text-white/70">{member.phone ?? '—'}</TableCell>
                  <TableCell className="text-white/70">{member.state}</TableCell>
                  <TableCell className="text-white/50 text-sm">{formatDate(member.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
