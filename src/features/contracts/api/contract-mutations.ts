import { mutationOptions } from '@tanstack/react-query'
import {
   createContract,
   updateContract,
   terminateContract,
   reactivateContract,
   type ContractCreateInput,
   type ContractUpdatePatch,
   type ContractTerminatePatch,
} from '@/shared/contracts/api'

export const createContractOptions = mutationOptions({
   mutationFn: (input: ContractCreateInput) => createContract(input),
   meta: { errorMessage: 'Nu am putut crea contractul.' },
})

export const updateContractOptions = (id: number) =>
   mutationOptions({
      mutationFn: (patch: ContractUpdatePatch) => updateContract(id, patch),
      meta: { errorMessage: 'Nu am putut actualiza contractul.' },
   })

export const terminateContractOptions = (id: number) =>
   mutationOptions({
      mutationFn: (patch: ContractTerminatePatch) => terminateContract(id, patch),
      meta: { errorMessage: 'Nu am putut termina contractul.' },
   })

export const reactivateContractOptions = (id: number) =>
   mutationOptions({
      mutationFn: () => reactivateContract(id),
      meta: { errorMessage: 'Nu am putut reactiva contractul.' },
   })
